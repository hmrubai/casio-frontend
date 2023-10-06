import { Subject } from 'rxjs';

export class Timer {
    interval: any;
    timeLeft: number = 0;
    hour: number = 0;
    minute: number = 0;
    second: number = 0;

    private status: Subject<string> = new Subject<string>();    // consider putting the actual type of the data you will receive
    public isRunning: boolean = false;

    update() {
        this.hour = Math.floor(this.timeLeft / 3600);
        this.minute = Math.floor(this.timeLeft / 60) % 60;
        this.second = this.timeLeft % 60;
    }

    start(seconds: any) {
        this.timeLeft = seconds;
        this.isRunning = true;
        this.status.next('running');
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.timeLeft = 60;
            }
            this.update();
            if (this.timeLeft === 0) {
                this.end();
            }
        }, 1000);
        return this.status.asObservable();
    }

    stop() {
        if (this.interval)
            clearInterval(this.interval);
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.timeLeft = 0;
        if (this.isRunning) {
            this.isRunning = false;
            this.status.next('stopped');
        }
        this.status.next('stopped');
    }

    private end(){
        if (this.interval)
            clearInterval(this.interval);
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.timeLeft = 0;
        if (this.isRunning) {
            this.isRunning = false;
        }
        this.status.next('ended');
    }
}