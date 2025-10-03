import { JSONSchemaType } from 'json-schema-typed'

export const userSettingsSchema = {
	general: {
		type: JSONSchemaType.Object,
		properties: {
			theme: { type: JSONSchemaType.String, },
			backgroundOpacity: { 
				type: JSONSchemaType.Boolean,
				default: false
			},
			language: { type: JSONSchemaType.String },
			chatMode: {
				type: JSONSchemaType.Object,
				default: {
					enable: true,
				}
			},
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
			},
			layout: {
				type: JSONSchemaType.Object,
				default: {
					mode: "minimalist",
				}
			}
		},
		default: {
			theme: 'system',
			language: 'es-us',
			chatMode: false
		},
	},
	models: {
		type: JSONSchemaType.Object,
		properties: {
			current: { type: JSONSchemaType.String },
			gemini: {
				type: JSONSchemaType.Object,
				default: {
					version: 'gemini-2.5-flash',
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
	},
	tabs: {
		type: JSONSchemaType.Object,
	}
}
