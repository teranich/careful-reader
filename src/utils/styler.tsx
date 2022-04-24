const MAX_WORD_CLASSES = 100;

export function hightLightElementsOnScreen(
    screenElement: any,
    allElements: any,
): any[] {
    const onScreen: any[] = [];
    if (!screenElement) return onScreen;
    const viewportTop = screenElement.scrollTop;
    const viewportHeight = screenElement.clientHeight;
    const viewportBottom = viewportTop + viewportHeight;
    for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        if (isOnScreen(el, screenElement)) {
            stylize(el);
            onScreen.push(el);
        }
        if (el.offsetTop > viewportBottom) {
            break;
        }
    }
    return onScreen;
}

export function getStyledElement(text: string) {
    // const separator = /(?:,| |&nbsp;|\.)+/
    const indexes = shuffle([...Array(MAX_WORD_CLASSES).keys()]);
    const separator = ' ';
    let index = 0;
    const children = text
        .split(separator)
        .map((word: string) => {
            index = index >= MAX_WORD_CLASSES ? 0 : index + 1;
            return `<span class="w${indexes[index]}">${word}</span>`;
        })
        .join(separator);
    const wrapper = document.createElement('hlw');
    wrapper.innerHTML = children;
    return wrapper;
}

const SHUFFLED = shuffle([...Array(MAX_WORD_CLASSES).keys()]);
let prev = 0
const next = () => {
    prev ++;
    if (prev > SHUFFLED.length - 1) prev = 0
    return SHUFFLED[prev];
}
export function stylizeJSX(jsx) {
    return <span className={`w${next()}`}>{jsx}</span>;
}

function shuffle<T>(array: Array<T>) {
    return array.sort(() => Math.random() - 0.5);
}

function textNodesUnder(el: HTMLElement) {
    let n;
    const result = [];
    let walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    while ((n = walk.nextNode())) result.push(n);
    return result;
}

export function stylize(element: HTMLElement) {
    if (element.className.includes('hg')) return;

    textNodesUnder(element).forEach((textElement: any) => {
        if (textElement) {
            const styledTextElement = getStyledElement(
                textElement.textContent,
            );
            textElement.replaceWith(styledTextElement);
            element.className += ' hg';
        }
    });
}

export function isOnScreen(
    el: HTMLElement,
    screenContainerElement: HTMLElement,
) {
    const viewportTop = screenContainerElement.scrollTop;
    const viewportHeight = screenContainerElement.clientHeight;
    const viewportBottom = viewportTop + viewportHeight;
    const top = el.offsetTop;
    const height = el.clientHeight;
    const bottom = top + height;

    return (
        (top >= viewportTop && top < viewportBottom) ||
        (bottom > viewportTop && bottom <= viewportBottom) ||
        (height > viewportHeight &&
            top <= viewportTop &&
            bottom >= viewportBottom)
    );
}
