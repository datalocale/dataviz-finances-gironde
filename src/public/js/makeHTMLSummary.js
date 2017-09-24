
function createSpanClone(node){
    const clone = document.createElement('span'); 
    clone.textContent = node.textContent;
    return clone;
}

export default function(htmlString, threshold = 500){
    const result = document.createElement('div');
    let characterCount = 0;

    const fakeRenderElement = document.createElement('div');
    fakeRenderElement.setAttribute('hidden', '');

    // all the children created from this call can be mutated freely
    fakeRenderElement.innerHTML = htmlString;

    Array.from(fakeRenderElement.children).forEach(node => {
        if(characterCount >= threshold)
            return;

        const textLength = node.textContent.length;

        if(characterCount + textLength < threshold){
            result.append(node);
            characterCount += textLength;
        }
        else{
            const count = threshold - (characterCount + textLength);
            node.textContent = node.textContent.slice(0, count) + ' (…)';

            result.append(node);
            characterCount += count;
            
        }
    });

    // remove inner links
    const links = result.querySelectorAll('a');
    Array.from(links).forEach(l => {
        l.replaceWith(createSpanClone(l));
    })
    

    return result.innerHTML;
}
