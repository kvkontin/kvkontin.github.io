/*
    Class LightDark
    Manages display mode (light background vs dark background).
    Uses local storage to save user preference across refreshes.
*/

class Lightdark {
    static KEY = 'mode';
    static TRUE_VALUE = 'dark';
    static FALSE_VALUE = 'light';
    #window;
    #callback;
    #isDark;
    #load;
    #save;

    constructor(window, changeCallback) {
        if(!typeof window === 'Window') {
            throw new TypeError(`Object is not a Window: ${window}`);
        }
        this.#window = window;
        this.#callback = changeCallback;

        this.#load = () => {

            // fall back on light mode
            let shouldBeDark = false;

            // check local storage first
            if (this.#window.localStorage && this.#window.localStorage.getItem(Lightdark.KEY)) {
                shouldBeDark = this.#window.localStorage.getItem(Lightdark.KEY) == Lightdark.TRUE_VALUE;
            }

            // if no local storage, check browser preference
            else if (this.#window.matchMedia
             && this.#window.matchMedia('(prefers-color-scheme: dark)').matches) {
                shouldBeDark = true;
            }

            // save choice to local storage
            this.setDark(shouldBeDark);
            this.#save();
        }

        this.#save = () => {
            if (!this.#window.localStorage) {return;}
            this.#window.localStorage.setItem(Lightdark.KEY,
                this.#isDark ? Lightdark.TRUE_VALUE : Lightdark.FALSE_VALUE);
        }

        this.#load();
    }


    isDark() {
        return this.#isDark;
    }


    toggle() {
        this.setDark(!this.#isDark);
    }


    setDark(dark) {
        if(!typeof dark === 'bool') {
            throw new TypeError(`Value is not boolean: ${dark}`);
        }
        this.#isDark = dark;
        this.#save();
        this.#callback(this.#isDark);
    }
}

export default Lightdark;