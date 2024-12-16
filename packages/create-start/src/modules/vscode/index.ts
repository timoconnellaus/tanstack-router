import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import { initHelpers } from '../../utils/helpers'
import { createModule } from '../../module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const vsCodeModule = createModule(z.object({}))
  .init((schema) => schema)
  .prompt((schema) => schema)
  .validateAndApply({
    validate: async ({ targetPath }) => {
      const _ = initHelpers(__dirname, targetPath)

      return await _.getTemplateFilesThatWouldBeOverwritten({
        file: '**/*',
        templateFolder: './template',
        targetFolder: targetPath,
        overwrite: false,
      })
    },
    apply: async ({ targetPath }) => {
      // Copy the vscode template folders into the project
      const _ = initHelpers(__dirname, targetPath)

      // TODO: Handle when the settings file already exists and merge settings

      await _.copyTemplateFiles({
        file: '**/*',
        templateFolder: './template',
        targetFolder: '.',
        overwrite: false,
      })
    },
  })