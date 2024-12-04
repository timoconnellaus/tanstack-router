import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'
import invariant from 'tiny-invariant'
import { helperFactory } from './helperFactory'
import { checkFileExists } from './base-utils'

export const createWriteTargetFile = helperFactory(
  ({ targetPath }) =>
    async (
      relativePath: string,
      content: string,
      overwrite: boolean = false,
    ) => {
      const path = resolve(targetPath, relativePath)
      invariant(
        !(!overwrite && (await checkFileExists(path))),
        `File ${relativePath} already exists and overwrite is false`,
      )
      await writeFile(path, content)
    },
)
