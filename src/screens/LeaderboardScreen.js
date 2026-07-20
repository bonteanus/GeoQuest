import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGeoQuest } from "../context/GeoQuestContext";

export default function LeaderboardScreen() {
  const {
    users,
    players,
    caches,
    finds,
    currentPlayer,
    loading,
    refreshData,
  } = useGeoQuest();

  const [refreshing, setRefreshing] = useState(false);

  const leaderboard = useMemo(() => {
    const rankedPlayers = players.map((player) => {
      const user = users.find(
        (item) => item.UserID === player.PlayerUserID
      );

      const playerFinds = finds.filter(
        (find) => find.FindPlayerID === player.PlayerID
      );

      // Prevent an accidental duplicate find from awarding points twice.
      const discoveredCacheIDs = [
        ...new Set(
          playerFinds.map((find) => find.FindCacheID)
        ),
      ];

      const points = discoveredCacheIDs.reduce(
        (total, cacheID) => {
          const cache = caches.find(
            (item) => item.CacheID === cacheID
          );

          return total + (cache?.CachePoints ?? 0);
        },
        0
      );

      const fullName = user
        ? `${user.UserFirstname} ${user.UserLastname}`
        : "Unknown Player";

      return {
        playerID: player.PlayerID,
        userID: player.PlayerUserID,
        name: fullName,
        username: user?.UserUsername ?? "",
        points,
        discoveries: discoveredCacheIDs.length,
      };
    });

    return rankedPlayers
      .sort((firstPlayer, secondPlayer) => {
        if (secondPlayer.points !== firstPlayer.points) {
          return secondPlayer.points - firstPlayer.points;
        }

        if (
          secondPlayer.discoveries !==
          firstPlayer.discoveries
        ) {
          return (
            secondPlayer.discoveries -
            firstPlayer.discoveries
          );
        }

        return firstPlayer.name.localeCompare(
          secondPlayer.name
        );
      })
      .map((player, index) => ({
        ...player,
        rank: index + 1,
      }));
  }, [caches, finds, players, users]);

  const currentLeaderboardEntry = leaderboard.find(
    (player) =>
      player.playerID === currentPlayer?.PlayerID
  );

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await refreshData();
    } finally {
      setRefreshing(false);
    }
  }

  function getRankStyle(rank) {
    if (rank === 1) {
      return styles.goldRank;
    }

    if (rank === 2) {
      return styles.silverRank;
    }

    if (rank === 3) {
      return styles.bronzeRank;
    }

    return styles.standardRank;
  }

  function renderPlayer({ item }) {
    const isCurrentPlayer =
      item.playerID === currentPlayer?.PlayerID;

    const initial =
      item.name.trim().charAt(0).toUpperCase() || "?";

    return (
      <View
        style={[
          styles.playerCard,
          isCurrentPlayer && styles.currentPlayerCard,
        ]}
      >
        <View
          style={[
            styles.rankCircle,
            getRankStyle(item.rank),
          ]}
        >
          {item.rank === 1 ? (
            <Ionicons
              name="trophy"
              size={20}
              color="#6B4F00"
            />
          ) : (
            <Text style={styles.rankNumber}>
              {item.rank}
            </Text>
          )}
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initial}
          </Text>
        </View>

        <View style={styles.playerInformation}>
          <View style={styles.nameRow}>
            <Text
              style={styles.playerName}
              numberOfLines={1}
            >
              {item.name}
            </Text>

            {isCurrentPlayer && (
              <View style={styles.youBadge}>
                <Text style={styles.youBadgeText}>
                  YOU
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.playerDetails}>
            {item.discoveries}{" "}
            {item.discoveries === 1
              ? "discovery"
              : "discoveries"}
            {item.username
              ? `  •  @${item.username}`
              : ""}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreNumber}>
            {item.points}
          </Text>

          <Text style={styles.scoreLabel}>
            points
          </Text>
        </View>
      </View>
    );
  }

  if (loading && players.length === 0) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color="#236B4E"
        />

        <Text style={styles.loadingText}>
          Loading leaderboard...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["left", "right", "bottom"]}
    >
      <FlatList
        data={leaderboard}
        keyExtractor={(item) =>
          String(item.playerID)
        }
        renderItem={renderPlayer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#236B4E"]}
            tintColor="#236B4E"
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.headingCard}>
              <View style={styles.headingIcon}>
                <Ionicons
                  name="trophy"
                  size={32}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.heading}>
                Global Leaderboard
              </Text>

              <Text style={styles.headingDescription}>
                Discover caches and earn points to climb
                the GeoQuest rankings.
              </Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {currentLeaderboardEntry
                      ? `#${currentLeaderboardEntry.rank}`
                      : "—"}
                  </Text>

                  <Text style={styles.summaryLabel}>
                    Your rank
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {currentLeaderboardEntry?.points ?? 0}
                  </Text>

                  <Text style={styles.summaryLabel}>
                    Your points
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {currentLeaderboardEntry?.discoveries ??
                      0}
                  </Text>

                  <Text style={styles.summaryLabel}>
                    Finds
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.listHeadingRow}>
              <Text style={styles.listHeading}>
                Player rankings
              </Text>

              <Text style={styles.playerCount}>
                {leaderboard.length} players
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Ionicons
              name="people-outline"
              size={42}
              color="#7A8580"
            />

            <Text style={styles.emptyTitle}>
              No players available
            </Text>

            <Text style={styles.emptyMessage}>
              Player rankings will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7F6",
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F6",
  },
  loadingText: {
    color: "#667085",
    fontSize: 15,
    marginTop: 12,
  },
  headingCard: {
    alignItems: "center",
    backgroundColor: "#236B4E",
    borderRadius: 20,
    padding: 22,
  },
  headingIcon: {
    width: 58,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 29,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 12,
  },
  headingDescription: {
    color: "#D9EFE4",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 7,
  },
  summaryRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 15,
    paddingVertical: 14,
    marginTop: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  summaryLabel: {
    color: "#D9EFE4",
    fontSize: 11,
    marginTop: 3,
  },
  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: "rgba(255,255,255,0.24)",
  },
  listHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  listHeading: {
    color: "#1F2933",
    fontSize: 19,
    fontWeight: "bold",
  },
  playerCount: {
    color: "#667085",
    fontSize: 13,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  currentPlayerCard: {
    backgroundColor: "#EAF7F0",
    borderColor: "#78BC96",
    borderWidth: 2,
  },
  rankCircle: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  goldRank: {
    backgroundColor: "#FFD76A",
  },
  silverRank: {
    backgroundColor: "#D8DEE3",
  },
  bronzeRank: {
    backgroundColor: "#E8B184",
  },
  standardRank: {
    backgroundColor: "#EAF7F0",
  },
  rankNumber: {
    color: "#344054",
    fontSize: 16,
    fontWeight: "bold",
  },
  avatar: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#236B4E",
    borderRadius: 22,
    marginLeft: 10,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  playerInformation: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerName: {
    flexShrink: 1,
    color: "#1F2933",
    fontSize: 15,
    fontWeight: "bold",
  },
  youBadge: {
    backgroundColor: "#236B4E",
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 7,
  },
  youBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  playerDetails: {
    color: "#667085",
    fontSize: 12,
    marginTop: 4,
  },
  scoreContainer: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  scoreNumber: {
    color: "#236B4E",
    fontSize: 20,
    fontWeight: "bold",
  },
  scoreLabel: {
    color: "#667085",
    fontSize: 11,
    marginTop: 1,
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  emptyTitle: {
    color: "#1F2933",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
  },
  emptyMessage: {
    color: "#667085",
    fontSize: 14,
    marginTop: 5,
  },
});