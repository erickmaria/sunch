import { JSONSchemaType } from 'json-schema-typed'

export const userSettingsSchema = {
	general: {
		type: JSONSchemaType.Object,
		properties: {
			theme: { type: JSONSchemaType.String, },
			language: { type: JSONSchemaType.String },
			media: {
				type: JSONSchemaType.Object,
				default: {
					microphone: '',
					speaker: '',
				}
			},
			notification: {
				type: JSONSchemaType.Object,
				default: {
					enable: true,
				}
			}
		},
		default: {
			theme: 'auto',
			language: 'es-us'	
		},
	},
	models: {
		type: JSONSchemaType.Object,
		properties: {
			current: { type: JSONSchemaType.String},
			gemini: {
				type: JSONSchemaType.Object,
				default: {
					version: 'gemini-pro',
					apikey: ''
				}
			},
			gpt: {
				type: JSONSchemaType.Object,
				default: {
					version: 'gpt-3.5-turbo',
					apikey: ''
				}
			},
		},
		default: {
			current: 'gemini',
		}
	}
}
