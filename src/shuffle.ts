import { curry } from "ramda";

export default curry(function shuffle(rounds: number, arr: any[]): any[] {
    let i: number = arr.length;

    while (i > 0) {
        const ri: number = Math.floor(Math.random() * i);
        [arr[i], arr[ri]] = [arr[ri], arr[i]];
        i -= 1;
    }

    return rounds > 1 ? shuffle(rounds - 1, arr) : arr;
});