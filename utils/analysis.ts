import { Expense, Persona, Story, Future, Action } from '../app/types';

export function analyzeExpenses(expenses: Expense[]): { persona: Persona, story: Story, futures: Future[], actions: Action[] } {
  // Categorize
  const foodExpenses = expenses.filter(e => (e.category === 'Food') || e.description.toLowerCase().includes('swiggy') || e.description.toLowerCase().includes('zomato'));
  const lateNightFood = foodExpenses.filter(e => {
    const hour = parseInt(e.time.split(':')[0]);
    return hour >= 22 || hour <= 5;
  });

  // Persona
  let persona: Persona;
  if (lateNightFood.length > 2) {
    persona = {
      name: 'Night Owl Swiggy',
      description: 'Someone who orders food late at night for comfort and convenience.'
    };
  } else {
    persona = {
      name: 'Balanced Spender',
      description: 'A mindful spender with moderate habits.'
    };
  }

  // Story
  const totalFood = foodExpenses.reduce((sum, e) => sum + e.amount, 0);
  const story: Story = {
    text: `Your month shows a pattern of spending on food, totaling ₹${totalFood}. ${lateNightFood.length > 0 ? `Week 2 ends with another late night. ₹${lateNightFood[0]?.amount || 0} disappears quietly, not because you're hungry, but because sleep feels optional.` : 'You maintain a steady spending on essentials.'}`
  };

  // Futures
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const futures: Future[] = [
    {
      scenario: 'noChange',
      description: `Continuing this habit, in 6 months you might spend an additional ₹${totalSpent * 6}, delaying your goals.`
    },
    {
      scenario: 'smallChange',
      description: `By redirecting ₹800/month from late-night food, that trip happens in July instead of December.`
    }
  ];

  // Actions
  const actions: Action[] = [
    {
      description: 'Move ₹800 from late-night food into a SIP-like bucket.'
    }
  ];

  return { persona, story, futures, actions };
}