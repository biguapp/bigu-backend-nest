import { ModuleMetadata } from '@nestjs/common'

export interface ResendOptions {
  apiKey: 're_Nukcfmn7_7GsfZHBufESb93bfBUEx9ME1'
}

export interface ResendOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useFactory: (...args: any[]) => ResendOptions | Promise<ResendOptions>
  inject?: any[]
}
