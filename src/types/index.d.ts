// Definisikan tipe data untuk struktur JSON
type Scene = {
    type: string;
    content?: string;
    speaker?: string;
    message?: string;
}

export type Story = {
    id: number;
    title: string;
    slug: string;
    description: string;
    scenes: Scene[];
}