export class Scheduler {
  public cronExpression = "* * * * *";

  everyMinute() {
    return this.spliceIntoPosition(1, '*');
  }

  everyFiveMinutes() {
    return this.spliceIntoPosition(1, '*/5');
  }

  everyTenMinutes() {
    return this.spliceIntoPosition(1, '*/10');
  }

  everyFifteenMinutes() {
    return this.spliceIntoPosition(1, '*/15');
  }

  everyThirtyMinutes() {
    return this.spliceIntoPosition(1, '0,30');
  }

  hourly() {
    return this.spliceIntoPosition(1, 0);
  }

  hourlyAt(offset: string) {
    return this.spliceIntoPosition(1, offset);
  }

  daily() {
    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0);
  }

  at(time: string) {
    return this.dailyAt(time);
  }

  dailyAt(time: string) {
    const segments = time.split(':');

    return this.spliceIntoPosition(2, segments)
      .spliceIntoPosition(1, segments.length === 2 ? segments[1] : '0');
  }

  twiceDaily(first: number = 1, second: number = 13) {
    const hours = `${first},${second}`;

    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, hours);
  }

  weekdays() {
    return this.spliceIntoPosition(5, '1-5');
  }

  weekends() {
    return this.spliceIntoPosition(5, '0,6');
  }

  mondays() {
    return this.days(1);
  }

  tuesdays() {
    return this.days(2);
  }

  wednesdays() {
    return this.days(3);
  }

  thursdays() {
    return this.days(4);
  }

  fridays() {
    return this.days(5);
  }

  saturdays() {
    return this.days(6);
  }

  sundays() {
    return this.days(0);
  }

  weekly() {
    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0)
      .spliceIntoPosition(5, 0);
  }

  weeklyOn(day: number, time: string = '0:0') {
    this.dailyAt(time);

    return this.spliceIntoPosition(5, day);
  }

  monthly() {
    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0)
      .spliceIntoPosition(3, 1);
  }

  monthlyOn(day: number = 1, time: string = '0:0') {
    this.dailyAt(time);

    return this.spliceIntoPosition(3, day);
  }

  twiceMonthly(first: number = 1, second: number = 16) {
    const days = `${first},${second}`;

    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0)
      .spliceIntoPosition(3, days);
  }

  quarterly() {
    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0)
      .spliceIntoPosition(3, 1)
      .spliceIntoPosition(4, '1-12/3');
  }

  yearly() {
    return this.spliceIntoPosition(1, 0)
      .spliceIntoPosition(2, 0)
      .spliceIntoPosition(3, 1)
      .spliceIntoPosition(4, 1);
  }

  days(...args: any) {
    let days;
    if (args.length === 1 && Array.isArray(args)) {
      days = args[0];
    } else {
      days = args;
    }

    return this.spliceIntoPosition(5, days.join(","));
  }

  spliceIntoPosition(position, value) {
    const segments = this.cronExpression.split(" ");
    segments[position - 1] = value;

    return this.cron(segments.join(" "));
  }

  cron(expression) {
    this.cronExpression = expression;
    return this;
  }
}
