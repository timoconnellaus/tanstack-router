import { z } from 'zod'
import { InvalidArgumentError, createOption } from '@commander-js/extra-typings'
import { select } from '@inquirer/prompts'
import { createModule } from '../module'
import { SUPPORTED_PACKAGE_MANAGERS } from '../constants'
import { getPackageManager } from '../utils/getPackageManager'
import { install } from '../utils/runPackageManagerCommand'

const schema = z.object({
  packageManager: z.enum(SUPPORTED_PACKAGE_MANAGERS),
  installDeps: z.boolean(),
})

const DEFAULT_PACKAGE_MANAGER = 'npm'
const options = schema.shape.packageManager.options
type PackageManager = z.infer<typeof schema>['packageManager']

export const packageManagerOption = createOption(
  `--package-manager <${options.join('|')}>`,
  `use this Package Manager (${options.join(', ')})`,
).argParser((value) => {
  if (!options.includes(value as PackageManager)) {
    throw new InvalidArgumentError(
      `Invalid Package Manager: ${value}. Only the following are allowed: ${options.join(', ')}`,
    )
  }
  return value as PackageManager
})

const packageManager = createModule(
  z.object({
    packageManager: z.enum(SUPPORTED_PACKAGE_MANAGERS).optional(),
    installDeps: z.boolean().optional(),
  }),
)
  .init((schema) =>
    schema.transform((vals) => {
      return {
        packageManager: vals.packageManager ?? getPackageManager(),
        installDeps: vals.installDeps,
      }
    }),
  )
  .prompt((schema) =>
    schema.transform(async (vals) => {
      const packageManager =
        vals.packageManager != undefined
          ? vals.packageManager
          : await select({
              message: 'Select a package manager',
              choices: options.map((pm) => ({ value: pm })),
              default: getPackageManager() ?? DEFAULT_PACKAGE_MANAGER,
            })

      const installDeps =
        vals.installDeps != undefined
          ? vals.installDeps
          : await select({
              message: 'Install dependencies',
              choices: [
                { name: 'yes', value: true },
                { name: 'no', value: false },
              ],
              default: 'yes',
            })

      return {
        installDeps,
        packageManager,
      }
    }),
  )
  .validateAndApply({
    spinnerConfigFn: (cfg) => {
      return cfg.installDeps
        ? {
            error: `Failed to install dependencies with ${cfg.packageManager}`,
            inProgress: `Installing dependencies with ${cfg.packageManager}`,
            success: `Installed dependencies with ${cfg.packageManager}`,
          }
        : undefined
    },
    apply: async ({ cfg, targetPath }) => {
      if (cfg.installDeps) {
        await install(cfg.packageManager, targetPath)
      }
    },
  })

export default packageManager
