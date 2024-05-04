import { JSONSchemaType } from 'json-schema-typed'

export const userSettingsShema = {
    theme: {
		type: JSONSchemaType.String,
		default: 'auto'
	},
	geminiApiKey: {
		type: JSONSchemaType.String,
		default: ''
	},
    gptApiKey: {
		type: JSONSchemaType.String,
		default: ''
	}
}