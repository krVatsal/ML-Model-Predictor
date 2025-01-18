#include <bits/stdc++.h>
using namespace std;
int findSafeRoute(int n, vector<pair<int, int>> &roads, vector<int> &thieves, int k, int start, int end) {
    unordered_set<int> unsafe;
    for (int thief : thieves) {
        unsafe.insert(thief);
        for (int i = 1; i <= k; i++) {
            if (thief - i >= 0) unsafe.insert(thief - i);
            if (thief + i < n) unsafe.insert(thief + i);
        }
    }

    vector<vector<int>> adjList(n);
    for (auto road : roads) {
        adjList[road.first].push_back(road.second);
        adjList[road.second].push_back(road.first);
    }

    queue<pair<int, int>> q;
    vector<bool> visited(n, false);

    q.push({start, 0});

    while (!q.empty()) {
        auto [current, distance] = q.front();
        q.pop();

        if (current == end) return distance;
        if (visited[current] || unsafe.count(current)) continue;

        visited[current] = true;

        for (int neighbor : adjList[current]) {
            if (!visited[neighbor] && !unsafe.count(neighbor)) {
                q.push({neighbor, distance + 1});
            }
        }
    }

    return -1;
}

int main() {
    int n, m;
    cin >> n >> m;

    vector<pair<int, int>> roads(m);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        roads[i] = {u, v};
    }

    int t;
    cin >> t;

    vector<int> thieves(t);
    for (int i = 0; i < t; i++) {
        cin >> thieves[i];
    }

    int k;
    cin >> k;

    int start, end;
    cin >> start >> end;

    cout << findSafeRoute(n, roads, thieves, k, start, end) << endl;

    return 0;
}