package recipe

type CreateIngredientRequest struct {
	Name     string `json:"name" binding:"required"`
	Quantity string `json:"quantity"`
	Unit     string `json:"unit"`
	Note     string `json:"note"`
	Order    int    `json:"order"`
}

type UpdateIngredientRequest struct {
	Name     *string `json:"name"`
	Quantity *string `json:"quantity"`
	Unit     *string `json:"unit"`
	Note     *string `json:"note"`
	Order    *int    `json:"order"`
	Checked  *bool   `json:"checked"`
}