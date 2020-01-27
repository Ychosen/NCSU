excute 3 py file use:
1. degree
spark-submit --packages graphframes:graphframes:0.7.0-spark2.4-s_2.11 degree.py ./stanford_graphs/amazon.graph.large large

2. centrality
spark-submit --packages graphframes:graphframes:0.7.0-spark2.4-s_2.11 centrality.py

3. articulation
spark-submit --packages graphframes:graphframes:0.7.0-spark2.4-s_2.11 articulation.py 9_11_edgelist.txt
