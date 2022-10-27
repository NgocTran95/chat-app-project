export const generateKeyWords = (displayName) => {
    let keywords = []
    const subStrArr = displayName.split(' ')
    subStrArr.forEach(subStr => {
        const length = subStr.length
        let keyword
        for (let i = 1; i <= length; i++) {
            keyword = subStr.slice(0, i)
            keywords.push(keyword)
        }
    })
    return keywords
}

