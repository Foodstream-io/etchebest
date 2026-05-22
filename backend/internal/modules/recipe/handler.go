package recipe

import (
	"net/http"
	"strings"

	"github.com/Foodstream-io/etchebest/internal/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetIngredients(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		roomID := c.Param("roomId")

		live, err := GetLiveByRoomID(db, roomID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "live not found"})
			return
		}

		ingredients, err := GetIngredientsByLiveID(db, live.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get ingredients"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"ingredients": ingredients,
		})
	}
}

func CreateNewIngredient(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		roomID := c.Param("roomId")
		currentUserID := utils.GetContextString(c, "userId")

		live, err := GetLiveByRoomID(db, roomID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "live not found"})
			return
		}

		if live.UserID != currentUserID {
			c.JSON(http.StatusForbidden, gin.H{"error": "only the host can edit ingredients"})
			return
		}

		var req CreateIngredientRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		name := strings.TrimSpace(req.Name)
		if name == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ingredient name is required"})
			return
		}

		ingredient := RecipeIngredient{
			LiveID:   live.ID,
			Name:     name,
			Quantity: strings.TrimSpace(req.Quantity),
			Unit:     strings.TrimSpace(req.Unit),
			Note:     strings.TrimSpace(req.Note),
			Order:    req.Order,
			Checked:  false,
		}

		if err := CreateIngredient(db, &ingredient); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create ingredient"})
			return
		}

		c.JSON(http.StatusCreated, ingredient)
	}
}

func UpdateExistingIngredient(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		roomID := c.Param("roomId")
		ingredientID := c.Param("ingredientId")
		currentUserID := utils.GetContextString(c, "userId")

		live, err := GetLiveByRoomID(db, roomID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "live not found"})
			return
		}

		if live.UserID != currentUserID {
			c.JSON(http.StatusForbidden, gin.H{"error": "only the host can edit ingredients"})
			return
		}

		ingredient, err := GetIngredientByID(db, ingredientID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "ingredient not found"})
			return
		}

		if ingredient.LiveID != live.ID {
			c.JSON(http.StatusForbidden, gin.H{"error": "ingredient does not belong to this live"})
			return
		}

		var req UpdateIngredientRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		if req.Name != nil {
			name := strings.TrimSpace(*req.Name)
			if name == "" {
				c.JSON(http.StatusBadRequest, gin.H{"error": "ingredient name cannot be empty"})
				return
			}
			ingredient.Name = name
		}

		if req.Quantity != nil {
			ingredient.Quantity = strings.TrimSpace(*req.Quantity)
		}

		if req.Unit != nil {
			ingredient.Unit = strings.TrimSpace(*req.Unit)
		}

		if req.Note != nil {
			ingredient.Note = strings.TrimSpace(*req.Note)
		}

		if req.Order != nil {
			ingredient.Order = *req.Order
		}

		if req.Checked != nil {
			ingredient.Checked = *req.Checked
		}

		if err := UpdateIngredient(db, ingredient); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update ingredient"})
			return
		}

		c.JSON(http.StatusOK, ingredient)
	}
}

func DeleteExistingIngredient(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		roomID := c.Param("roomId")
		ingredientID := c.Param("ingredientId")
		currentUserID := utils.GetContextString(c, "userId")

		live, err := GetLiveByRoomID(db, roomID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "live not found"})
			return
		}

		if live.UserID != currentUserID {
			c.JSON(http.StatusForbidden, gin.H{"error": "only the host can edit ingredients"})
			return
		}

		ingredient, err := GetIngredientByID(db, ingredientID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "ingredient not found"})
			return
		}

		if ingredient.LiveID != live.ID {
			c.JSON(http.StatusForbidden, gin.H{"error": "ingredient does not belong to this live"})
			return
		}

		if err := DeleteIngredient(db, ingredientID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete ingredient"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "ingredient deleted"})
	}
}