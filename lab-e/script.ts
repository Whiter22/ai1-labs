// const msg: string = "Hello!";
// alert(msg);
const stylesDictionary: {[key: string]: string} = {
    style0: 'style/style.css',
    style1: 'style/style1.css'
};

function changeStyle(styleKey: string): void {
    const currentStyleLink = document.getElementById('current-style') as HTMLLinkElement;
    const newStyleLink = stylesDictionary[styleKey];

    if (newStyleLink && currentStyleLink) {
        currentStyleLink.href = newStyleLink;
    }
}

document.getElementById('style1-link')?.addEventListener('click', () => changeStyle('style0'));
document.getElementById('style2-link')?.addEventListener('click', () => changeStyle('style1'));