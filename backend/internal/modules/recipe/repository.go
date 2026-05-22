package recipe

import (
	liveModule "github.com/Foodstream-io/etchebest/internal/modules/live"
	"gorm.io/gorm"
)

func GetLiveByRoomID(db *gorm.DB, roomID string) (*liveModule.Live, error) {
	var live liveModule.Live

	if err := db.Where("room_id = ?", roomID).First(&live).Error; err != nil {
		return nil, err
	}

	return &live, nil
}

func GetIngredientsByLiveID(db *gorm.DB, liveID uint) ([]RecipeIngredient, error) {
	var ingredients []RecipeIngredient

	err := db.
		Where("live_id = ?", liveID).
		Order(`"order" ASC`).
		Order("created_at ASC").
		Find(&ingredients).Error

	return ingredients, err
}

func GetIngredientByID(db *gorm.DB, id string) (*RecipeIngredient, error) {
	var ingredient RecipeIngredient

	if err := db.First(&ingredient, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return &ingredient, nil
}

func CreateIngredient(db *gorm.DB, ingredient *RecipeIngredient) error {
	return db.Create(ingredient).Error
}

func UpdateIngredient(db *gorm.DB, ingredient *RecipeIngredient) error {
	return db.Save(ingredient).Error
}

func DeleteIngredient(db *gorm.DB, id string) error {
	return db.Delete(&RecipeIngredient{}, "id = ?", id).Error
}