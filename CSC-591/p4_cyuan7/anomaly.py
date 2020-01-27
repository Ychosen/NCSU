import os
import sys
import hashlib
import networkx as nx
import numpy as np
B = 64


def generate_graph(filename):
    """
    Read a single file and generate a graph

    :param filename:
    :return: Graph
    """

    G = nx.Graph()
    file = open(filename, 'r')
    first_line = True
    edges = []
    for line in file:
        if first_line:
            first_line = False
            continue
        edge = line.split()
        edges.append(edge)
    G.add_edges_from(edges)
    return G


def process_files(dir):
    '''
    Read in directory and generate all graph into :graphs

    :return: List(G)
    '''

    graphs = []
    filenames = sorted(os.listdir(dir), key=lambda name: int(name[:name.index('_')]))
    for filename in filenames:
        G = generate_graph(dir + filename)
        graphs.append(G)

    return graphs


def sim_hash(graph, pagerank):
    '''
    Core function

    :param graph:
    :param pagerank:
    :return:
    '''
    # Set of weighted features
    L = [0] * B

    # Node tokens
    for node in graph.nodes():
        weight = pagerank[node]
        l = get_hash_value(node, weight)
        for i in range(B):
            L[i] += l[i]

    # Edge token
    for tup in graph.edges():
        edge = tup[0] + '-' + tup[1]
        weight = pagerank[tup[0]] / graph.degree(tup[0])
        l = get_hash_value(edge, weight)
        for i in range(B):
            L[i] += l[i]

    res = [1 if num > 0 else 0 for num in L]
    return res


def get_hash_value(s, weight):
    '''
    Randomly project token :s into :B dimensional space,
    choosing :B entries from {-wi, +wi}
    :param s:
    :param weight:
    :return:
    '''
    l = []
    result = hashlib.sha256(s.encode())
    num = int(result.hexdigest(), 16)
    for i in range(B):
        l.append(weight if num & 1 else -weight)
        num >>= 1
    return l


def hamming(h1, h2):
    '''
    Calculate hamming distance of h1 and h2
    :param h1:
    :param h2:
    :return:
    '''
    res = 0
    for i in range(B):
        if h1[i] != h2[i]:
            res += 1

    return res


def graph_sim_dif(graphs):
    '''
    Pre-calculate page rank
    Prepossess graphs into sim_hash problem
    :param graphs:
    :return:
    '''
    graph_sim_difs = []
    L = len(graphs)
    i = 0
    while i < L - 1:
        graph1 = graphs[i]
        graph2 = graphs[i+1]
        pagerank1 = nx.pagerank(graph1)
        pagerank2 = nx.pagerank(graph2)
        h1 = sim_hash(graph1, pagerank1)
        h2 = sim_hash(graph2, pagerank2)

        graph_sim_difs.append(1 - hamming(h1, h2) / B)
        i += 1

    return graph_sim_difs


if __name__ == "__main__":
    dir = sys.argv[1]
    # dir = 'datasets/autonomous/'
    # dir = 'datasets/voices/'
    # dir = 'datasets/enron_by_day/'
    # dir = 'datasets/p2p-Gnutella/'
    graphs = process_files(dir)
    graph_sim_diffs = graph_sim_dif(graphs)
    L = len(graphs)
    i = 0
    M = 0
    while i < L - 2:
        M += abs(graph_sim_diffs[i] - graph_sim_diffs[i + 1])
        i += 1
    M /= (L - 1)
    threshold = np.median(graph_sim_diffs) - 3 * M
    i = 0
    flag = False
    anomalous = []
    while i < L - 1:
        if graph_sim_diffs[i] < threshold:
            if flag:
                anomalous.append(i)
            else:
                flag = True
        else:
            flag = False
        i += 1

    f = open('time_series.txt', 'w')
    f.write('threshold: ' + str(threshold) + '\n')
    for i, a in enumerate(graph_sim_diffs):
        s = 'time ' + str(i) + ' - ' + str(i+1) + '\tsimilarity score: \t' + str(a)
        f.write(s+'\n')
