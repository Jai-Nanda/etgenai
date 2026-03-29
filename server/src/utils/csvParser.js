import fs from 'fs';
import csv from 'csv-parser';
import { createReadStream } from 'fs';

// Auto-categorization rules
const categoryRules = [
  { keywords: ['swiggy', 'zomato', 'cafe', 'restaurant', 'food', 'pizza', 'burger', 'dinner', 'lunch', 'breakfast'], category: 'Food' },
  { keywords: ['uber', 'ola', 'metro', 'taxi', 'petrol', 'fuel', 'diesel', 'transport', 'travel'], category: 'Travel' },
  { keywords: ['amazon', 'myntra', 'flipkart', 'shopping', 'store', 'mall', 'purchase'], category: 'Shopping' },
  { keywords: ['netflix', 'spotify', 'prime', 'hotstar', 'movie', 'gaming', 'entertainment'], category: 'Entertainment' },
  { keywords: ['fee', 'course', 'books', 'college', 'school', 'education', 'tuition'], category: 'Education' },
  { keywords: ['hospital', 'clinic', 'pharmacy', 'medicine', 'doctor', 'health'], category: 'Health' },
  { keywords: ['electricity', 'water', 'rent', 'recharge', 'bill', 'bills', 'utility'], category: 'Bills' },
  { keywords: ['salary', 'income', 'refund', 'deposit', 'bonus', 'credit'], category: 'Income' },
];

function autoCategorize(description) {
  if (!description) return 'Others';
  
  const desc = description.toLowerCase();
  
  for (const rule of categoryRules) {
    if (rule.keywords.some(keyword => desc.includes(keyword))) {
      return rule.category;
    }
  }
  
  return 'Others';
}

function normalizeTransaction(row, sourceFileName) {
  try {
    // Handle different CSV formats
    let date = row.Date || row.date || row.DATE || row['Transaction Date'];
    let description = row.Description || row.description || row.DESCRIPTION || row.Narration || row.Particulars;
    let amount = row.Amount || row.amount || row.AMOUNT;
    let debit = row.Debit || row.debit || row.DEBIT;
    let credit = row.Credit || row.credit || row.CREDIT;
    let type = row.Type || row.type || row.TYPE;

    // Skip rows without essential data
    if (!date || (!amount && !debit && !credit)) {
      return null;
    }

    // Parse amount
    let finalAmount = 0;
    let finalType = 'expense';

    if (amount) {
      finalAmount = Math.abs(parseFloat(amount));
      if (parseFloat(amount) < 0) {
        finalType = 'expense';
      } else {
        finalType = 'income';
      }
    } else if (debit || credit) {
      if (debit) {
        finalAmount = Math.abs(parseFloat(debit));
        finalType = 'expense';
      } else if (credit) {
        finalAmount = Math.abs(parseFloat(credit));
        finalType = 'income';
      }
    }

    // Parse date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return null;
    }

    // Auto-categorize
    const category = autoCategorize(description);

    return {
      date: parsedDate,
      description: description?.trim() || 'Unknown Transaction',
      amount: finalAmount,
      type: finalType,
      category,
      sourceFileName
    };
  } catch (error) {
    console.warn('Error normalizing transaction:', error);
    return null;
  }
}

export async function parseCSVFile(filePath, sourceFileName) {
  return new Promise((resolve, reject) => {
    const transactions = [];
    const errors = [];

    createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const transaction = normalizeTransaction(row, sourceFileName);
          if (transaction) {
            transactions.push(transaction);
          }
        } catch (error) {
          errors.push({ row, error: error.message });
        }
      })
      .on('end', () => {
        resolve({
          transactions,
          errors,
          totalProcessed: transactions.length,
          totalErrors: errors.length
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export function deleteCSVFile(filePath) {
  return fs.unlink(filePath).catch(error => {
    console.warn('Warning: Could not delete CSV file:', error.message);
  });
}
