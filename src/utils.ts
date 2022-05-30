export function makeImage(id:string, format?:string){
    return `https://image.tmdb.org/t/p/${format?format:"original"}/${id}`
}

//format 이미지 사이즈나, original
