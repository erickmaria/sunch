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
			theme: 'system',
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
					version: 'gemini-2.0-flash',
					apikey: ''
				}
			},
			gpt: {
				type: JSONSchemaType.Object,
				default: {
					version: 'gpt-4o-mini',
					apikey: ''
				}
			},
			claude: {
				type: JSONSchemaType.Object,
				default: {
					version: 'claude-3-5-sonnet-latest',
					apikey: ''
				}
			},
		},
		default: {
			current: 'gemini',
		}
	}
}
