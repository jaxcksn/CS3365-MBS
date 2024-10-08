import {
  Group,
  Text,
  DefaultMantineColor,
  AspectRatio,
  Paper,
} from "@mantine/core";

export interface MovieCardProps {
  title: string;
  badgeColor?: DefaultMantineColor;
  badgeText?: string;
  imageSrc?: string;
  type: "current" | "upcoming";
}

export default function MovieCard(props: MovieCardProps) {
  return (
    <AspectRatio ratio={414 / 620} mx="auto">
      <Paper
        className="movie-card"
        shadow="md"
        radius="md"
        style={{
          backgroundImage: `url(${
            props.imageSrc ?? "https://source.unsplash.com/random/414x620"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Group align="flex-end" h="100%">
          <Text fw="900" lh={1.2} fz="1.5rem" c="white" p="sm">
            {props.title}
          </Text>
        </Group>
      </Paper>
    </AspectRatio>
  );
}
