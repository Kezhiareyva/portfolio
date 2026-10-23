import type { ServerProps } from 'payload'

type BeforeLoginProps = Partial<Pick<ServerProps, 'i18n'>>

export function BeforeLogin({ i18n }: BeforeLoginProps) {
  const isId = i18n?.language === 'id'

  return (
    <p className="kz-login-hello">
      <span aria-hidden="true" className="kz-login-hello__dot" />
      {isId
        ? 'Halo lagi! Masuk dulu, yuk, untuk memperbarui isi kezhia.online.'
        : 'Welcome back! Sign in to update what shows on kezhia.online.'}
    </p>
  )
}
