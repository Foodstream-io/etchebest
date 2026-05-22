package recipe

import (
	"time"

	liveModule "github.com/Foodstream-io/etchebest/internal/modules/live"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RecipeIngredient struct {
	ID string `gorm:"type:uuid;primaryKey" json:"id"`

	LiveID uint            `gorm:"not null;index" json:"live_id"`
	Live   liveModule.Live `gorm:"foreignKey:LiveID;constraint:OnDelete:CASCADE;" json:"-"`

	Name     string `gorm:"type:varchar(120);not null" json:"name"`
	Quantity string `gorm:"type:varchar(40)" json:"quantity"`
	Unit     string `gorm:"type:varchar(30)" json:"unit"`
	Note     string `gorm:"type:varchar(255)" json:"note"`

	Order   int  `gorm:"not null;default:0" json:"order"`
	Checked bool `gorm:"not null;default:false" json:"checked"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (ri *RecipeIngredient) BeforeCreate(tx *gorm.DB) error {
	if ri.ID == "" {
		ri.ID = uuid.New().String()
	}

	return nil
}