document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        document.body.className = currentTheme === 'dark' ? 'dark-mode' : 'light-mode';
        localStorage.setItem('theme', currentTheme);
    });

    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateAge);

    const dateInput = document.getElementById('date');
    dateInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');

        const value = parseInt(e.target.value);
        if (value > 31) {
            e.target.value = '31';
        }
    });

    const monthInput = document.getElementById('month');
    monthInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');

        const value = parseInt(e.target.value);
        if (value > 12) {
            e.target.value = '12';
        }
    });

    const yearInput = document.getElementById('year');
    yearInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');

        const currentYear = new Date().getFullYear();
        const value = parseInt(e.target.value);
        if (value > currentYear) {
            e.target.value = currentYear.toString();
        }
    });

    [dateInput, monthInput, yearInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateAge();
            }
        });
    });
});

function calculateAge() {
    const dayInput = document.getElementById('date');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');

    const day = parseInt(dayInput.value);
    const month = parseInt(monthInput.value);
    const year = parseInt(yearInput.value);

    document.getElementById('dateError').textContent = '';
    document.getElementById('monthError').textContent = '';
    document.getElementById('yearError').textContent = '';

    let hasError = false;

    if (!dayInput.value) {
        document.getElementById('dateError').textContent = 'Day is required';
        hasError = true;
    } else if (day < 1 || day > 31) {
        document.getElementById('dateError').textContent = 'Must be a valid day';
        hasError = true;
    }

    if (!monthInput.value) {
        document.getElementById('monthError').textContent = 'Month is required';
        hasError = true;
    } else if (month < 1 || month > 12) {
        document.getElementById('monthError').textContent = 'Must be a valid month';
        hasError = true;
    }

    if (!yearInput.value) {
        document.getElementById('yearError').textContent = 'Year is required';
        hasError = true;
    } else if (yearInput.value.length < 4) {
        document.getElementById('yearError').textContent = 'Year must be 4 digits';
        hasError = true;
    }

    if (day && month && !hasError) {
        const monthDays = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (day > monthDays[month - 1]) {
            document.getElementById('dateError').textContent = `Invalid day for ${getMonthName(month)}`;
            hasError = true;
        }
    }

    const currentDate = new Date();
    const birthDate = new Date(year, month - 1, day);

    if (birthDate > currentDate && !hasError) {
        document.getElementById('yearError').textContent = 'Date cannot be in the future';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    let years, months, days;

    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    years = currentYear - year;

    if (currentMonth >= month) {
        months = currentMonth - month;
    } else {
        years--;
        months = 12 + currentMonth - month;
    }

    if (currentDay >= day) {
        days = currentDay - day;
    } else {
        months--;
        const monthDays = [31, isLeapYear(currentYear) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        days = monthDays[(currentMonth > 1 ? currentMonth - 2 : 11)] + currentDay - day;

        if (months < 0) {
            months = 11;
            years--;
        }
    }

    const resultElement = document.getElementById('result');
    const ageResultElement = document.getElementById('ageResult');

    ageResultElement.innerHTML = `
        <div>You are</div>
        <div class="large-text">${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}, and ${days} ${days === 1 ? 'day' : 'days'} old</div>
    `;

    resultElement.classList.add('active');
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getMonthName(monthNum) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1];
}