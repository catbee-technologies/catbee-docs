export default function VersionBadge({ version }: { version: string }) {
  return (
    <div
      style={{
        background: '#222',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        marginBottom: '12px',
        display: 'inline-block',
        fontSize: '12px'
      }}
    >
      {version}
    </div>
  );
}
