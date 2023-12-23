// BANKIST APP
'use strict';

// =====================================================================
// Data
const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2,
	pin: 1111,
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,
};

const account3 = {
	owner: 'Steven Thomas Williams',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: 'Sarah Smith',
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// =====================================================================
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// =====================================================================

const createUsernames = function (accs) {
	accs.forEach(acc => {
		acc.username = acc.owner
			.split(' ')
			.map(str => str[0])
			.join('')
			.toLowerCase();
	});
};

const updateUI = function (acc) {
	displayMovements(acc.movements);
	// as we add the account balance property to the obj itself
	// we need the balance to be directly available for other things
	calcDisplayBalance(acc);
	calcDisplaySummary(acc);
};

createUsernames(accounts);
// console.log(account1);

// store the currentAccount
let currentAccount = undefined;

// notice that the login stuff is a form
// inputLoginUsername, inputLoginPin are form inputs
// btnLogin is the submit button of the form
// whenever you click on the button, the form is submitted
// the form also gets submitted when you press Enter
// when any form input is active
// you will see the below console.log() when you do any of the above
// as all above inputs call below event listener
// even though it is applied on just btnLogin
btnLogin.addEventListener('click', function (evt) {
	// To prevent submission of form which refreshes the page
	evt.preventDefault();

	// console.log('Clicked on button / Pressed Enter in input fields');
	const username = inputLoginUsername.value;
	const pin = Number(inputLoginPin.value);

	currentAccount = accounts.find(acc => acc.username === username);

	// notice ?.
	if (currentAccount?.pin == pin) {
		labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
		containerApp.style.opacity = 100;

		inputLoginUsername.value = '';
		inputLoginPin.value = '';

		// if we login via Enter after entering the username, pin
		// then the focus and the cursor stays on the input fields
		inputLoginUsername.blur();
		inputLoginPin.blur();

		updateUI(currentAccount);
	}
});

btnTransfer.addEventListener('click', function (evt) {
	evt.preventDefault();

	const amount = Number(inputTransferAmount.value);
	const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);

	// notice that we first check if the receiverAccount exists
	// we cannot use ?. because
	// for currentAccount.owner !== receiverAccount?.owner
	// if receiverAccount does not exist, (currentAccount.owner !== undefined) is true
	if (
		receiverAccount &&
		amount > 0 &&
		amount < currentAccount.balance &&
		currentAccount.owner !== receiverAccount.owner
	) {
		console.log('Transfer successful.');

		currentAccount.movements.push(-amount);
		transferAccount.movements.push(amount);

		updateUI(currentAccount);
	}

	inputTransferTo.value = '';
	inputTransferAmount.value = '';
});

const displayMovements = function (movements) {
	// reset the container first
	containerMovements.innerHTML = '';

	movements.forEach(function (mov, i) {
		const type = mov > 0 ? 'deposit' : 'withdrawal';

		const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <!-- <div class="movements__date">3 days ago</div> -->
            <div class="movements__value">${mov} €</div>
        </div>`;

		// notice insertAdjacentHTML and not insertAdjacentElement
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const calcDisplayBalance = function (acc) {
	// add the balance property to the account obj itself
	acc.balance = acc.movements.reduce((bal, mov) => bal + mov, 0);
	labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
	const balIn = acc.movements.filter(mov => mov > 0).reduce((bal, mov) => bal + mov, 0);
	labelSumIn.textContent = `${balIn} €`;

	const balOut = acc.movements.filter(mov => mov < 0).reduce((bal, mov) => bal + mov, 0);
	labelSumOut.textContent = `${Math.abs(balOut)} €`;

	// ===============================
	// Interest assumption 1
	// assume 1.2% interest on each deposit

	// const rate = interestRate / 100;
	// const balInterest = acc.movements
	// 	.filter(mov => mov > 0)
	// 	.reduce((bal, mov) => bal + rate * mov, 0);
	// labelSumInterest.textContent = `${balInterest} €`;

	// ===============================
	// Interest assumption 2
	// assume 1.2% interest on each deposit where minimum interest value is 1 €

	const rate = acc.interestRate / 100;

	// Solution 1
	// const balInterest = acc.movements
	// 	.filter(mov => mov > 0)
	// 	.map(mov => mov * rate)
	// 	.filter(int => int >= 1)
	// 	.reduce((acc, cur) => acc + cur, 0);

	// Solution 2
	const balInterest = acc.movements
		.filter(mov => mov > 0)
		.reduce((bal, mov) => bal + (mov * rate >= 1 ? mov * rate : 0), 0);
	labelSumInterest.textContent = `${balInterest} €`;
};
