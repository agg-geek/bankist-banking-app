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

	movementDates: [],
	currency: 'INR',
	locale: 'en-IN',
	// locale: 'en-GB',
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementDates: [],
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

let currentAccount = undefined;
let sorted = false;

const createUsernames = function (accs) {
	accs.forEach(acc => {
		acc.username = acc.owner
			.split(' ')
			.map(str => str[0])
			.join('')
			.toLowerCase();
	});
};

createUsernames(accounts);

const addMovementDates = function () {
	const differenceDates = function (dates) {
		return dates.map(date => {
			const newDate = new Date();
			newDate.setDate(newDate.getDate() - date);
			return newDate.toISOString();
		});
	};

	const differenceDates1 = [96, 67, 42, 25, 10, 5, 1, 0];
	const differenceDates2 = [121, 82, 56, 36, 7, 4, 3, 1];

	account1.movementDates = differenceDates(differenceDates1);
	account2.movementDates = differenceDates(differenceDates2);
};

addMovementDates();

const setTimer = function () {
	let time = 100;

	setInterval(() => {
		const min = String(Math.floor(time / 60)).padStart(2, '0');
		const sec = String(time % 60).padStart(2, '0');
		labelTimer.textContent = `${min}:${sec}`;

		time--;
	}, 1000);
};

const updateUI = function (acc) {
	labelDate.textContent = formatDate(new Date().toISOString(), 1);

	setTimer();
	displayMovements(acc);
	calcDisplayBalance(acc);
	calcDisplaySummary(acc);
};

const formatDate = function (dateISOString, specifyHourMin = 0, relativeDate = 0) {
	const date = new Date(dateISOString);

	if (relativeDate) {
		const diffDays = (date1, date2) => Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
		const daysPassed = diffDays(date, new Date());
		if (daysPassed == 0) return 'Today';
		else if (daysPassed == 1) return 'Yesterday';
		else if (daysPassed < 7) return `${daysPassed} days ago`;
	}

	const options = {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
		...(specifyHourMin && { hour: 'numeric', minute: 'numeric' }),
	};
	return new Intl.DateTimeFormat(currentAccount.locale, options).format(date);
};

const formatCurrency = function (value) {
	return new Intl.NumberFormat(currentAccount.locale, {
		style: 'currency',
		currency: currentAccount.currency,
	}).format(value);
};

btnLogin.addEventListener('click', function (evt) {
	evt.preventDefault();

	const username = inputLoginUsername.value;
	const pin = Number(inputLoginPin.value);

	currentAccount = accounts.find(acc => acc.username === username);

	if (currentAccount?.pin == pin) {
		labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
		containerApp.style.opacity = 100;

		inputLoginUsername.value = '';
		inputLoginPin.value = '';

		inputLoginUsername.blur();
		inputLoginPin.blur();

		updateUI(currentAccount);
	}
});

btnTransfer.addEventListener('click', function (evt) {
	evt.preventDefault();

	const amount = Number(inputTransferAmount.value);
	const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);

	if (
		receiverAccount &&
		amount > 0 &&
		amount < currentAccount.balance &&
		currentAccount.owner !== receiverAccount.owner
	) {
		currentAccount.movements.push(-amount);
		currentAccount.movementDates.push(new Date().toISOString());

		receiverAccount.movements.push(amount);
		receiverAccount.movementDates.push(new Date().toISOString());

		updateUI(currentAccount);
	}

	inputTransferTo.value = '';
	inputTransferAmount.value = '';
});

btnLoan.addEventListener('click', function (evt) {
	evt.preventDefault();

	const amount = Math.floor(inputLoanAmount.value);

	if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
		currentAccount.movements.push(amount);
		currentAccount.movementDates.push(new Date().toISOString());
		updateUI(currentAccount);
	}
	inputLoanAmount.value = '';
	inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (evt) {
	evt.preventDefault();

	if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
		const idx = accounts.findIndex(acc => acc.username === currentAccount.username);

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

btnSort.addEventListener('click', function () {
	displayMovements(currentAccount, (sorted ^= 1));
});

const displayMovements = function (acc, sort = false) {
	containerMovements.innerHTML = '';

	const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
	movs.forEach(function (mov, i) {
		const type = mov > 0 ? 'deposit' : 'withdrawal';

		const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__date">${formatDate(acc.movementDates[i], 0, 1)}</div>
            <div class="movements__value">${formatCurrency(mov)}</div>
        </div>`;

		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const calcDisplayBalance = function (acc) {
	acc.balance = acc.movements.reduce((bal, mov) => bal + mov, 0);
	labelBalance.textContent = `${formatCurrency(acc.balance)}`;
};

const calcDisplaySummary = function (acc) {
	const balIn = acc.movements.filter(mov => mov > 0).reduce((bal, mov) => bal + mov, 0);
	labelSumIn.textContent = `${formatCurrency(balIn)}`;

	const balOut = acc.movements.filter(mov => mov < 0).reduce((bal, mov) => bal + mov, 0);
	labelSumOut.textContent = `${formatCurrency(Math.abs(balOut))}`;

	const rate = acc.interestRate / 100;

	const balInterest = acc.movements
		.filter(mov => mov > 0)
		.reduce((bal, mov) => bal + (mov * rate >= 1 ? mov * rate : 0), 0);
	labelSumInterest.textContent = `${formatCurrency(balInterest)}`;
};
