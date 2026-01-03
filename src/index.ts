import FormBuilder from './formBuilder/FormBuilder';
import PredefinedGallery from './formBuilder/PredefinedGallery';
import { addCardObj, addSectionObj } from './formBuilder/utils';

export { FormBuilder, PredefinedGallery, addCardObj, addSectionObj };

// Export types for use in custom form inputs and mods
// These are public API types - import from publicTypes.ts
export type {
  // Core mods type - main interface for customizing FormBuilder
  Mods,
  // Custom form input types - used in Mods.customFormInputs
  FormInput,
  Match, // Used in FormInput.matchIf to define matching criteria
  // Component types - used in FormInput.cardBody and FormInput.modalBody
  CardComponent,
  CardComponentType, // @deprecated - Use CardComponent instead (backward compatibility alias)
  CardComponentProps, // Props passed to CardComponent components
  CardComponentPropsType, // @deprecated - Use CardComponentProps instead (backward compatibility alias)
  // Mods configuration types
  ModLabels, // Used in Mods.labels
  DataOptions, // Used in Mods.newElementDefaultDataOptions
  AddFormObjectParameters, // Used in Mods.components.add callback
  DefinitionData, // Used in AddFormObjectParameters.definitionData
  // JSON Schema types - used throughout for type safety
  JsonSchema,
  JsonSchemaProperty,
  UiSchema,
  UiSchemaProperty,
  DataType, // Used in FormInput.type and Match.types
  // FormBuilder callback types
  InitParameters, // Used in FormBuilder.onMount callback
} from './formBuilder/publicTypes';
