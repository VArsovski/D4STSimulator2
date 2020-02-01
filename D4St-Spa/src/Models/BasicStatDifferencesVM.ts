export class BasicStatDifferencesVM<T> {
    data: T;
    show: boolean;
    update: boolean;

    constructor(stats: T, show: boolean = false, update: boolean = false) {
        this.data = stats || new Object() as T;//T();
        this.show = show || false;
        this.update = update || false;
    }
}
