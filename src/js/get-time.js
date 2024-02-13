import { fetchTimeOfDay } from './api/api.js';

export default class GetTime {
    constructor() {
        this.START_MORNING = 6 * 60;
        this.onInit();
    }

    async detectTimeOfDay() {
        try {
            const result = await fetchTimeOfDay();

            if (!result) {
                throw new Error('Error');
            }

            let time = result.datetime.slice(11, 16).split(':');

            time = Number(time[0]) * 60 + Number(time[1]);

            if (time < this.START_MORNING) {
                this.toggleSwitcherActive();
            }
        } catch (error) {
            console.error(error);
        }
    }

    toggleSwitcherActive() {
        document.documentElement.classList.add('theme-alt');
        document.querySelectorAll('.switcher--theme').forEach(el => {
            el.classList.add('switcher--active');
        });
    }

    onInit() {
        this.detectTimeOfDay();
    }
}
