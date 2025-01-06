
export async function createThumbnail(base64Image: string, width: number, height: number): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = `${base64Image}`;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/png"));
            }
        };
    });
}


export function saveThumbnailToLocalStorage(key: string, thumbnailBase64: string) {
    localStorage.setItem(key, thumbnailBase64);
};

export function getThumbnailFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
}

export function deleteThumbnailFromLocalStorage(key: string) {
    localStorage.removeItem(key);
}