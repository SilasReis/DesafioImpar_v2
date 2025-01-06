import api from "../Api/api";
import ICard from '../../types/ICard';
import { createThumbnail, getThumbnailFromLocalStorage, saveThumbnailToLocalStorage } from "../../utils/thumbFile";
import { toastError } from "../../utils/toastHot";


export async function fetchCards(page: number, itemsToLoad: number): Promise<ICard[]> {
    try {
        const response = await api.get<ICard[]>(`/car`, {
            params: { page, itens: itemsToLoad },
        });

        if (response.status === 200) {
            const cards = await Promise.all(
                response.data.map(async (card) => {
                    const cachedThumbnail = getThumbnailFromLocalStorage(card.id.toString());

                    if (cachedThumbnail) {
                        return { ...card, photo: { id: card.photo.id, base64: cachedThumbnail } };
                    }

                    const thumbnailBase64 = await createThumbnail(card.photo.base64, 100, 100);
                    saveThumbnailToLocalStorage(card.id.toString(), thumbnailBase64);

                    return { ...card, photo: { id: card.photo.id, base64: thumbnailBase64 } };
                })
            );

            return cards;
        }

        toastError("Erro inesperado ao buscar os cards da API");
        return [];

    } catch (error) {
        if (error instanceof Error) {
            toastError("Erro ao tentar buscar os cards!");
        } else {
            toastError("Erro desconhecido ao tentar buscar os cards!");
        }
        return [];
    }
}

export async function fetchCardsByName(searchTerm: string): Promise<ICard[]> {
    try {
        const response = await api.get(`/car/GetByName/${searchTerm}`);

        if (response.status === 200) {
            return response.data;
        } else {
            toastError("Erro ao buscar os cards pelo nome!");
        }
        return [];

    } catch (error) {
        toastError("Erro ao tentar buscar os cards pelo nome!");
        return [];
    }
}


export async function saveCard(card: ICard): Promise<string> {

    try {
        const response = await api.post("/car", card);

        if (response.status === 200) {
            return ("Card criado com sucesso!");
        } else {
            return ("Erro ao salvar o card");
        }

    } catch (error) {
        return ("Erro ao salvar o card");
    }
}

export async function editCard(card: ICard): Promise<string> {
    try {
        const response = await api.put("/car", card);

        if (response.status === 200) {
            return ("Card alterado com sucesso!");
        } else {
            return ("Erro ao editar o card");
        }

    } catch (error) {
        return ("Erro ao editar o card");
    }
}

export async function deleteCard(card: ICard): Promise<string> {
    try {
        const response = await api.delete(`/car`, {
            params: {
                id: card.id,
            },
        });

        if (response.status === 200) {
            return ("Card excluído com sucesso!");
        } else {
            return ("Erro ao excluir o card!");
        }

    } catch (error) {
        return ("Erro ao editar o card");
    }
}

export const createCardObject = (name: string, fileBase64: string, id: number = 0, photoId: number = 0): ICard => {
    return {
        id,
        name,
        status: true,
        photo: {
            id: photoId,
            base64: fileBase64,
        },
    };
};

export const validateCardFields = (name: string, fileBase64: string): { isValid: boolean; errors: { name?: string; file?: string } } => {
    const errors: { name?: string; file?: string } = {};

    if (!name.trim())
        errors.name = "O título é obrigatório.";
    if (!fileBase64)
        errors.name = "A imagem é obrigatória.";

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};