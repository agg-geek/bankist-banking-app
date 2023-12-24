// BANKIST APP
'use strict';

// =====================================================================
// Old data
// const account1 = {
// 	owner: 'Jonas Schmedtmann',
// 	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
// 	interestRate: 1.2,
// 	pin: 1111,
// };

// const account2 = {
// 	owner: 'Jessica Davis',
// 	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
// 	interestRate: 1.5,
// 	pin: 2222,
// };

// const account3 = {
// 	owner: 'Steven Thomas Williams',
// 	movements: [200, -200, 340, -300, -20, 50, 400, -460],
// 	interestRate: 0.7,
// 	pin: 3333,
// };

// const account4 = {
// 	owner: 'Sarah Smith',
// 	movements: [430, 1000, 700, 50, 90],
// 	interestRate: 1,
// 	pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// =====================================================================
// New data

const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2,
	pin: 1111,

	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2020-05-08T14:11:59.604Z',
		'2020-07-26T17:01:17.194Z',
		'2020-07-28T23:36:17.929Z',
		'2020-08-01T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'pt-PT', // de-DE
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const accounts = [account1, account2];

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
// to display movements sorted or unsorted
let sorted = false;

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

// loan is sanctioned if there is any deposit with value >= 10% of requested loan amount
btnLoan.addEventListener('click', function (evt) {
	evt.preventDefault();

	const amount = Number(inputLoanAmount.value);

	if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
		currentAccount.movements.push(amount);
		updateUI(currentAccount);
	}
	inputLoanAmount.value = '';
	inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (evt) {
	evt.preventDefault();

	if (
		inputCloseUsername.value === currentAccount.username &&
		Number(inputClosePin.value) === currentAccount.pin
	) {
		const idx = accounts.findIndex(acc => acc.username === currentAccount.username);

		// findIndex returns -1 if the account is not found
		// so splice will end up deleting the -1th elem, ie the last account
		// but since we are first checking if the account to delete is the currentAccount
		// so it'll definitely be found with idx >= 0
		// idx >= 0 && accounts.splice(idx, 1); // is not required
		accounts.splice(idx, 1);

		currentAccount = undefined;

		labelWelcome.textContent = 'Account closed!';
		containerApp.style.opacity = 0;
	}

	inputCloseUsername.value = '';
	inputClosePin.value = '';
	inputCloseUsername.blur();
	inputClosePin.blur();
});

// see the sorted state variable at the top
btnSort.addEventListener('click', function () {
	// Solution 1
	// displayMovements(currentAccount.movements, !sorted);
	// sorted = !sorted;

	// Solution 2
	displayMovements(currentAccount.movements, (sorted ^= 1));
});

const displayMovements = function (movements, sort = false) {
	// reset the container first
	containerMovements.innerHTML = '';

	// Notice that you first slice() the array to create a copy
	// as sort will mutate the array itself
	// and since arr is a reference value, don't mutate the original array in account obj
	const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

	movs.forEach(function (mov, i) {
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
