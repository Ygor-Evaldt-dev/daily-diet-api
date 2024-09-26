export type UpdateMealDto = {
    name?: string;
    description?: string;
    isOnDiet?: boolean;
    createdAt?: string;
    userId: string;
}