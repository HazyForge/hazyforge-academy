'use dom';

type CalBookingEmbedProps = {
  url: string;
  title: string;
  dom?: import('expo/dom').DOMProps;
};

export default function CalBookingEmbed({ url, title }: CalBookingEmbedProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: 560,
        background: '#02070b',
      }}>
      <iframe
        title={title}
        src={url}
        allow="camera; microphone; fullscreen; payment"
        style={{
          width: '100%',
          height: '100%',
          minHeight: 560,
          border: 0,
          background: '#02070b',
        }}
      />
    </div>
  );
}
