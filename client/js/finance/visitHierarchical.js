

export default function visit(node, f){
    f(node)
    
    if(node.children){
        Array.from(node.children.values()).forEach(child => {
            visit(child, f);
        })
    }
}

export function flattenTree(node){
    const result = [];
    visit(node, n => result.push(n));
    return result;
}