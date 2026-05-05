interface Props {
  title: string
  provider: string
  feature: string
  children: React.ReactNode
}

function OAuthProviderMessage({ provider, feature }: { provider: string; feature: string }) {
  const name = provider.charAt(0).toUpperCase() + provider.slice(1)
  return (
    <p className="text-white/30 text-sm">
      You signed in with {name} — {feature} changes are managed through your {name} account.
    </p>
  )
}

export default function AccountFormSection({ title, provider, feature, children }: Props) {
  return (
    <div className="pt-4 border-t border-white/10">
      <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">{title}</h3>
      {provider === 'email' ? (
        <div className="space-y-3">{children}</div>
      ) : (
        <OAuthProviderMessage provider={provider} feature={feature} />
      )}
    </div>
  )
}