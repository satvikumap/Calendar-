import SQLite from 'react-native-sqlite-storage';

// Open or create the database
const db = SQLite.openDatabase(
  {
    name: 'tasks.db',
    location: 'default',
  },
  () => {
    console.log('Database opened successfully');
  },
  error => {
    console.error('Error opening database:', error);
  }
);

// Function to create the tasks table
const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subtitle TEXT,
        date TEXT NOT NULL,
        UNIQUE(title, subtitle, date)
      );`,
      [],
      () => {
        console.log('Table created successfully');
      },
      error => {
        console.error('Error creating table:', error);
      }
    );
  });
};

// Function to insert a new task into the tasks table
export const insertTask = (title, subtitle, date) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tasks (title, subtitle, date) VALUES (?, ?, ?)',
        [title, subtitle, date],
        (_, result) => {
          console.log('Task inserted:', title, subtitle, date);
          logTasksTable(); // Log the table after inserting
          resolve(result);
        },
        (_, error) => {
          console.error('Error inserting task:', error);
          reject(error);
        }
      );
    });
  });
};

// Function to fetch tasks by date
export const fetchTasksByDate = (date) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks WHERE date = ?',
        [date],
        (_, result) => {
          const tasks = [];
          for (let i = 0; i < result.rows.length; i++) {
            tasks.push(result.rows.item(i));
          }
          resolve(tasks);
        },
        (_, error) => {
          console.error('Error fetching tasks by date:', error);
          reject(error);
        }
      );
    });
  });
};

// Function to fetch tasks by date range
export const fetchTasksByDateRange = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks WHERE date BETWEEN ? AND ?',
        [startDate, endDate],
        (_, result) => {
          const tasks = [];
          for (let i = 0; i < result.rows.length; i++) {
            tasks.push(result.rows.item(i));
          }
          resolve(tasks);
        },
        (_, error) => {
          console.error('Error fetching tasks by date range:', error);
          reject(error);
        }
      );
    });
  });
};
export const fetchAllTasks = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks',
        [],
        (_, result) => {
          const tasks = [];
          for (let i = 0; i < result.rows.length; i++) {
            tasks.push(result.rows.item(i));
          }
          resolve(tasks);
        },
        (_, error) => {
          console.error('Error fetching all tasks:', error);
          reject(error);
        }
      );
    });
  });
};
// Function to fetch all tasks and log them to the console
const logTasksTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM tasks',
      [],
      (_, result) => {
        const tasks = [];
        for (let i = 0; i < result.rows.length; i++) {
          tasks.push(result.rows.item(i));
        }
        console.log('All tasks:', tasks);
      },
      (_, error) => {
        console.error('Error logging tasks table:', error);
      }
    );
  });
};

// Call to create the table when the module is loaded
createTable();
