// enums (replace TypeScript unions)
export const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const Status = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};


//  * @typedef {Object} Task
//  * @property {string} id
//  * @property {string} title
//  * @property {string} description
//  * @property {'low' | 'medium' | 'high'} priority
//  * @property {'todo' | 'in-progress' | 'done'} status
//  * @property {string} dueDate
//  * @property {string} createdAt
//  */

// /**
//  * @typedef {Object} TaskFilter
//  * @property {'todo' | 'in-progress' | 'done'} [status]
//  * @property {'low' | 'medium' | 'high'} [priority]
//  * @property {string} [search]
