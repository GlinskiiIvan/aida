export const formatedDate = (value: Date | null): string => {
    let formattedDate = '—';

    if(value && value !== null) {
        const date = new Date(value);

        if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // добавляем ведущий ноль, если нужно
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        } 
    }

    return formattedDate;
}