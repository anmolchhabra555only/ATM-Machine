 // ATM simulation state
        let atmState = {
            cardInserted: false,
            pinEntered: false,
            pinInput: '',
            currentAction: null,
            account: {
                accountNumber: '123456789',
                pin: '5789',
                balance: 1000.00
            },
            cashAmount: 0
        };
        
        const atmScreen = document.getElementById('atm-screen');
        const atmCard = document.getElementById('atm-card');
        const cash = document.getElementById('cash');
        const insertCardBtn = document.getElementById('insert-card-btn');
        
        function updateScreen(message) {
            atmScreen.innerHTML = message.replace(/\n/g, '<br>');
        }
        
        function insertCard() {
            if (!atmState.cardInserted) {
                atmCard.classList.add('inserted');
                atmState.cardInserted = true;
                insertCardBtn.disabled = true;
                updateScreen("Welcome to Our ATM\nPlease enter your PIN:");
            }
        }
        
        function atmAction(action) {
            if (!atmState.pinEntered) {
                updateScreen("Please enter your PIN first");
                return;
            }
            
            atmState.currentAction = action;
            
            switch (action) {
                case 'balance':
                    updateScreen(`Current Balance: $${atmState.account.balance.toFixed(2)}`);
                    break;
                case 'deposit':
                    updateScreen("Enter deposit amount:");
                    break;
                case 'withdraw':
                    updateScreen("Enter withdrawal amount:");
                    break;
            }
        }
        
        function pressKey(number) {
            if (!atmState.cardInserted) {
                updateScreen("Please insert your card first");
                return;
            }
            
            if (atmState.currentAction === null && !atmState.pinEntered) {
                atmState.pinInput += number;
                updateScreen(`PIN: ${'•'.repeat(atmState.pinInput.length)}`);
                
                if (atmState.pinInput.length === 4) {
                    verifyPin();
                }
            } else if (atmState.currentAction === 'deposit' || atmState.currentAction === 'withdraw') {
                if (atmState.cashAmount === 0) {
                    atmState.cashAmount = number;
                } else {
                    atmState.cashAmount = parseFloat(atmState.cashAmount.toString() + number);
                }
                updateScreen(`Enter ${atmState.currentAction} amount:\n$${atmState.cashAmount}`);
            }
        }
        
        function verifyPin() {
            if (atmState.pinInput === atmState.account.pin) {
                atmState.pinEntered = true;
                updateScreen("PIN verified\n\nMain Menu:\n1. Check Balance\n2. Deposit Cash\n3. Withdraw Cash\n4. Exit");
            } else {
                updateScreen("Invalid PIN. Please try again.");
                atmState.pinInput = '';
            }
        }
        
        function enterPin() {
            if (atmState.pinInput.length > 0 && !atmState.pinEntered) {
                verifyPin();
            } else if (atmState.currentAction === 'deposit') {
                // Process deposit
                atmState.account.balance += atmState.cashAmount;
                updateScreen(`Deposited: $${atmState.cashAmount.toFixed(2)}\nNew Balance: $${atmState.account.balance.toFixed(2)}`);
                atmState.currentAction = null;
                atmState.cashAmount = 0;
            } else if (atmState.currentAction === 'withdraw') {
                // Process withdrawal
                if (atmState.cashAmount > atmState.account.balance) {
                    updateScreen("Insufficient funds");
                } else {
                    atmState.account.balance -= atmState.cashAmount;
                    cash.style.left = '50%';
                    setTimeout(() => {
                        cash.style.left = '-70px';
                    }, 1500);
                    updateScreen(`Withdrawn: $${atmState.cashAmount.toFixed(2)}\nNew Balance: $${atmState.account.balance.toFixed(2)}\nPlease take your cash`);
                }
                atmState.currentAction = null;
                atmState.cashAmount = 0;
            }
        }
        
        function clearInput() {
            if (atmState.currentAction) {
                atmState.cashAmount = 0;
                updateScreen(`Enter ${atmState.currentAction} amount:\n$0`);
            } else if (!atmState.pinEntered) {
                atmState.pinInput = '';
                updateScreen("Please enter your PIN:");
            }
        }
        
        function resetATM() {
            atmState = {
                cardInserted: false,
                pinEntered: false,
                pinInput: '',
                currentAction: null,
                account: {
                    accountNumber: '123456789',
                    pin: '5789',
                    balance: 1000.00
                },
                cashAmount: 0
            };
            
            atmCard.classList.remove('inserted');
            insertCardBtn.disabled = false;
            cash.style.left = '-70px';
            updateScreen("Welcome to Our ATM\nPlease insert your card (click 'Insert Card')");
        }