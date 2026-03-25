export interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  time: string;
  date: string;
  category?: string;
}

export interface Persona {
  name: string;
  description: string;
}

export interface Story {
  text: string;
}

export interface Future {
  scenario: 'noChange' | 'smallChange';
  description: string;
}

export interface Action {
  description: string;
}