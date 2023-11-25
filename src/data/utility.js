import {
    format,
    isToday,
    isPast,
    isThisWeek,
    addDays,
    isSunday,
    isMonday,
    isTuesday,
    isWednesday,
    isThursday,
    isFriday,
    isSaturday
} from 'date-fns';

export function dateConverter(date) {
    if (isToday(new Date(date))) {
        return 'Today';
    }

    if (isThisWeek(new Date(date)) && !isPast(new Date(date))) {
        switch (new Date(date).getDay()) {
            case 0:
                date = "Sunday";
                break;
            case 1:
                date = "Monday";
                break;
            case 2:
                date = "Tuesday";
                break;
            case 3:
                date = "Wednesday";
                break;
            case 4:
                date = "Thursday";
                break;
            case 5:
                date = "Friday";
                break;
            case 6:
                date = "Saturday";
        }
    }
    return date;
}

export function inputConverter(input) {
    if (input === 'today') {
        return format(new Date(), 'M/d/yyyy');
    }

    if (input === 'tomorrow') {
        return format(addDays(new Date(), 1), 'M/d/yyyy');
    }

    if (input === 'sunday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);
            if (isSunday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'monday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);
            if (isMonday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'tuesday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);

            if (isTuesday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'wednesday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);

            if (isWednesday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'thursday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);

            if (isThursday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'friday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);

            if (isFriday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'saturday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);

            if (isSaturday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    return input;
}
