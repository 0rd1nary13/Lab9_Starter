

// Custom error classes (Step 4 requirement)
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NetworkError extends Error {
  constructor(message, statusCode = null) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

class ConfigurationError extends Error {
  constructor(message, component = null) {
    super(message);
    this.name = 'ConfigurationError';
    this.component = component;
  }
}

// Step 5: Global error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.group('Global Error Caught');
  console.error('Message:', message);
  console.error('Source:', source);
  console.error('Line:', lineno, 'Column:', colno);
  console.error('Error Object:', error);
  console.groupEnd();
  
  // Prepare error data for tracking service
  const errorData = {
    message,
    source,
    lineno,
    colno,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.log('Error data for tracking:', errorData);
  return true;
};

// Handle promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.group('Unhandled Promise Rejection');
  console.error('Reason:', event.reason);
  console.error('Promise:', event.promise);
  console.groupEnd();
});

document.addEventListener('DOMContentLoaded', function() {
  let form = document.querySelector('form');
  
  // Step 3: Enhanced calculator with try/catch/finally
  form.addEventListener('submit', e => {
    e.preventDefault();
    let output = document.querySelector('output');
    let firstNum = document.querySelector('#first-num').value;
    let secondNum = document.querySelector('#second-num').value;
    let operator = document.querySelector('#operator').value;
    
    try {
      // Basic validation
      if (!firstNum || !secondNum) {
        throw new ValidationError('Both numbers are required');
      }
      
      const num1 = parseFloat(firstNum);
      const num2 = parseFloat(secondNum);
      
      if (isNaN(num1) || isNaN(num2)) {
        throw new ValidationError('Please enter valid numbers');
      }
      
      // Check division by zero
      if (operator === '/' && num2 === 0) {
        throw new ValidationError('Cannot divide by zero');
      }
      
      // Do the math
      let result;
      switch (operator) {
        case '+':
          result = num1 + num2;
          break;
        case '-':
          result = num1 - num2;
          break;
        case '*':
          result = num1 * num2;
          break;
        case '/':
          result = num1 / num2;
          break;
        default:
          throw new ConfigurationError('Invalid operator', 'Calculator');
      }
      
      // Make sure result is valid
      if (!isFinite(result)) {
        throw new ValidationError('Result is not a valid number');
      }
      
      output.innerHTML = `Result: ${result}`;
      output.style.color = 'black';
      
    } catch (error) {
      output.innerHTML = `${error.name}: ${error.message}`;
      output.style.color = 'red';
      console.error('Calculator error:', error);
    } finally {
      // Always runs
      console.log('Calculation completed');
      if (output.style.color === 'red') {
        setTimeout(() => {
          document.querySelector('#first-num').focus();
        }, 100);
      }
    }
  });

  let errorBtns = Array.from(document.querySelectorAll('#error-btns > button'));

  // Some test data for demos
  const testUser = {
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com',
    preferences: {
      theme: 'dark',
      notifications: true
    }
  };

  const employees = [
    { name: 'Alice', role: 'Developer', salary: 75000 },
    { name: 'Bob', role: 'Designer', salary: 65000 },
    { name: 'Charlie', role: 'Manager', salary: 85000 }
  ];

  // Step 2: Console method button handlers
  errorBtns.forEach((button, index) => {
    button.addEventListener('click', () => {
      switch (button.textContent) {
        case 'Console Log':
          console.log('Console Log Demo:', testUser);
          console.log('Multiple values:', 'Hello', 42, true, [1, 2, 3]);
          break;

        case 'Console Error':
          console.error('This is an error message!', {
            errorCode: 404,
            message: 'Resource not found',
            timestamp: new Date()
          });
          break;

        case 'Console Count':
          console.count('Button clicks');
          console.count('Button clicks');
          console.count('Different counter');
          console.count('Button clicks');
          break;

        case 'Console Warn':
          console.warn('Warning: Deprecated function used!', {
            function: 'oldFunction()',
            alternative: 'newFunction()',
            removeIn: 'v2.0'
          });
          break;

        case 'Console Assert':
          console.assert(5 > 10, 'Assertion failed: 5 is not greater than 10');
          console.assert(true, 'This assertion will not show');
          console.assert(testUser.age < 18, 'User is not a minor:', testUser);
          break;

        case 'Console Clear':
          console.clear();
          console.log('Console cleared! This message appears after clearing.');
          break;

        case 'Console Dir':
          console.dir(testUser);
          console.dir(document.querySelector('form'));
          break;

        case 'Console dirxml':
          console.dirxml(document.querySelector('main'));
          console.dirxml(document.querySelector('form'));
          break;

        case 'Console Group Start':
          console.group('User Information');
          console.log('Name:', testUser.name);
          console.log('Age:', testUser.age);
          console.group('Preferences');
          console.log('Theme:', testUser.preferences.theme);
          console.log('Notifications:', testUser.preferences.notifications);
          console.groupEnd();
          console.log('Email:', testUser.email);
          console.groupEnd();
          break;

        case 'Console Group End':
          console.groupCollapsed('Collapsed Group Example');
          console.log('This is inside a collapsed group');
          console.log('You can expand it to see these messages');
          console.groupEnd();
          break;

        case 'Console Table':
          console.table(employees);
          console.table(testUser);
          console.table(employees, ['name', 'salary']);
          break;

        case 'Start Timer':
          console.time('Performance Timer');
          console.time('Another Timer');
          console.log('Timers started! Click "End Timer" to see elapsed time.');
          // Some work to time
          for (let i = 0; i < 1000000; i++) {
            Math.random();
          }
          break;

        case 'End Timer':
          console.timeEnd('Performance Timer');
          console.timeEnd('Another Timer');
          console.timeEnd('Non-existent Timer');
          break;

        case 'Console Trace':
          function demoFunction() {
            function nestedFunction() {
              function deeplyNestedFunction() {
                console.trace('Trace from deeply nested function');
              }
              deeplyNestedFunction();
            }
            nestedFunction();
          }
          demoFunction();
          break;

        case 'Trigger a Global Error':
          // This will trigger the global error handler
          setTimeout(() => {
            throw new Error('Intentional error for testing global handler');
          }, 100);
          break;

        default:
          console.log('Button not implemented:', button.textContent);
      }
    });
  });

  // Demo output functions
  const output = document.getElementById('demo-output');

  function addOutput(message) {
    output.innerHTML += `<div style="margin: 5px 0; padding: 5px; border-left: 3px solid #007acc;">${message}</div>`;
    output.scrollTop = output.scrollHeight;
  }

  function clearOutput() {
    output.innerHTML = '';
  }

  // Safe DOM access demo
  document.getElementById('dom-manipulation').addEventListener('click', () => {
    clearOutput();
    addOutput('<strong>Safe DOM Access Demo:</strong>');
    
    try {
      const element = document.getElementById('does-not-exist');
      addOutput(`Trying to access non-existent element...`);
      
      if (!element) {
        throw new ValidationError('Element with id "does-not-exist" not found');
      }
      
      element.textContent = 'Found it!';
      
    } catch (error) {
      addOutput(`Error caught: ${error.name}: ${error.message}`);
      addOutput(`Handled missing DOM element gracefully`);
    } finally {
      addOutput(`DOM access attempt finished`);
      
      // Try safe access
      try {
        const safeElement = document.querySelector('output');
        addOutput(`Successfully accessed: ${safeElement.tagName}`);
      } catch (e) {
        addOutput(`Safe access failed: ${e.message}`);
      }
    }
  });

  // JSON parsing demo
  document.getElementById('json-parsing').addEventListener('click', () => {
    clearOutput();
    addOutput('<strong>JSON Parsing Demo:</strong>');
    
    const validJson = '{"name": "John", "age": 30}';
    const invalidJson = '{"name": "John", "age": 30,}';
    const badJson = '{"name": "John", "age":}';
    
    [validJson, invalidJson, badJson].forEach((jsonStr, index) => {
      try {
        addOutput(`Parsing JSON ${index + 1}...`);
        const parsed = JSON.parse(jsonStr);
        addOutput(`Success: ${JSON.stringify(parsed)}`);
      } catch (error) {
        addOutput(`JSON Parse Error: ${error.message}`);
        addOutput(`Bad JSON: ${jsonStr}`);
      } finally {
        addOutput(`JSON parsing ${index + 1} done`);
      }
    });
  });

  // LocalStorage demo
  document.getElementById('localStorage-demo').addEventListener('click', () => {
    clearOutput();
    addOutput('<strong>LocalStorage Demo:</strong>');
    
    try {
      // Normal storage
      const testData = { user: 'demo', timestamp: Date.now() };
      localStorage.setItem('demo-data', JSON.stringify(testData));
      addOutput(`Stored data in localStorage`);
      
      // Get it back
      const retrieved = JSON.parse(localStorage.getItem('demo-data'));
      addOutput(`Retrieved: ${JSON.stringify(retrieved)}`);
      
      // Try to store large data
      const largeData = 'x'.repeat(1000000);
      localStorage.setItem('large-data', largeData);
      addOutput(`Stored large data successfully`);
      
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        addOutput(`LocalStorage quota exceeded: ${error.message}`);
        addOutput(`Could fall back to session storage`);
        
        try {
          localStorage.removeItem('large-data');
          addOutput(`Cleaned up large data`);
        } catch (cleanupError) {
          addOutput(`Cleanup failed: ${cleanupError.message}`);
        }
      } else {
        addOutput(`LocalStorage error: ${error.message}`);
      }
    } finally {
      addOutput(`LocalStorage operation done`);
      // Cleanup
      try {
        localStorage.removeItem('demo-data');
        localStorage.removeItem('large-data');
      } catch (e) {
        // ignore
      }
    }
  });

  // Custom validation demo
  document.getElementById('custom-validation').addEventListener('click', () => {
    clearOutput();
    addOutput('<strong>Custom Validation Demo:</strong>');
    
    function validateUser(userData) {
      if (!userData) {
        throw new ValidationError('User data is required');
      }
      
      if (!userData.email || !userData.email.includes('@')) {
        throw new ValidationError('Valid email is required');
      }
      
      if (!userData.age || userData.age < 0 || userData.age > 150) {
        throw new ValidationError('Age must be between 0 and 150');
      }
      
      if (userData.password && userData.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
      }
      
      return true;
    }
    
    const testUsers = [
      { email: 'john@example.com', age: 30, password: 'secure123' },
      { email: 'invalid-email', age: 25, password: 'short' },
      { email: 'jane@example.com', age: -5, password: 'validpassword' },
      null,
      { email: 'bob@example.com', age: 45 }
    ];
    
    testUsers.forEach((user, index) => {
      try {
        addOutput(`Validating user ${index + 1}...`);
        validateUser(user);
        addOutput(`User ${index + 1} is valid`);
      } catch (error) {
        addOutput(`${error.name} for user ${index + 1}: ${error.message}`);
      } finally {
        addOutput(`Validation ${index + 1} completed`);
      }
    });
  });

  // Network simulation demo
  document.getElementById('network-simulation').addEventListener('click', () => {
    clearOutput();
    addOutput('<strong>Network Error Simulation:</strong>');
    
    async function fakeNetworkCall(url, shouldFail = false, statusCode = 500) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) {
            reject(new NetworkError(`Request failed: ${url}`, statusCode));
          } else {
            resolve({ data: `Response from ${url}`, status: 200 });
          }
        }, Math.random() * 1000 + 500);
      });
    }
    
    const requests = [
      { url: '/api/users', shouldFail: false },
      { url: '/api/posts', shouldFail: true, statusCode: 404 },
      { url: '/api/comments', shouldFail: true, statusCode: 500 }
    ];
    
    requests.forEach(async ({ url, shouldFail, statusCode }, index) => {
      try {
        addOutput(`Making request ${index + 1} to ${url}...`);
        const response = await fakeNetworkCall(url, shouldFail, statusCode);
        addOutput(`Request ${index + 1} succeeded: ${response.data}`);
      } catch (error) {
        if (error instanceof NetworkError) {
          addOutput(`${error.name} for request ${index + 1}: ${error.message} (Status: ${error.statusCode})`);
        } else {
          addOutput(`Request ${index + 1} failed: ${error.message}`);
        }
        addOutput(`Could retry request here`);
      } finally {
        addOutput(`Request ${index + 1} finished`);
      }
    });
  });

  // Safe property access demo
  document.getElementById('property-access').addEventListener('click', () => {
    clearOutput();
    addOutput('<strong>Safe Property Access Demo:</strong>');
    
    const testObjects = [
      { user: { profile: { name: 'John', settings: { theme: 'dark' } } } },
      { user: { profile: { name: 'Jane' } } },
      { user: null },
      null,
      { user: { profile: { name: 'Bob', settings: null } } }
    ];
    
    testObjects.forEach((obj, index) => {
      try {
        addOutput(`Accessing property in object ${index + 1}...`);
        
        // Unsafe access
        const theme = obj.user.profile.settings.theme;
        addOutput(`Theme found: ${theme}`);
        
      } catch (error) {
        addOutput(`Property access failed: ${error.message}`);
        
        // Safe alternative
        try {
          const safeTheme = obj?.user?.profile?.settings?.theme ?? 'default';
          addOutput(`Safe access result: ${safeTheme}`);
        } catch (safeError) {
          addOutput(`Safe access failed: ${safeError.message}`);
        }
        
      } finally {
        addOutput(`Property access ${index + 1} done`);
      }
    });
  });

  // Custom error types demo
  document.getElementById('custom-errors-demo').addEventListener('click', () => {
    clearOutput();
    addOutput('<strong>Custom Error Types Demo:</strong>');
    
    const errorTests = [
      {
        name: 'ValidationError',
        action: () => { throw new ValidationError('Username too short'); }
      },
      {
        name: 'NetworkError', 
        action: () => { throw new NetworkError('API connection failed', 503); }
      },
      {
        name: 'ConfigurationError',
        action: () => { throw new ConfigurationError('Missing API key', 'AuthModule'); }
      }
    ];
    
    errorTests.forEach(({ name, action }) => {
      try {
        addOutput(`Testing ${name}...`);
        action();
      } catch (error) {
        addOutput(`Caught ${error.name}: ${error.message}`);
        if (error.statusCode) {
          addOutput(`Status Code: ${error.statusCode}`);
        }
        if (error.component) {
          addOutput(`Component: ${error.component}`);
        }
        addOutput(`instanceof ValidationError: ${error instanceof ValidationError}`);
        addOutput(`instanceof NetworkError: ${error instanceof NetworkError}`);
        addOutput(`instanceof ConfigurationError: ${error instanceof ConfigurationError}`);
      } finally {
        addOutput(`${name} test done`);
      }
    });
  });
}); 