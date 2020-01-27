from pyspark import SparkContext
from pyspark.sql import SQLContext
from pyspark.sql import functions
from graphframes import *
from pyspark.sql.functions import explode

sc = SparkContext("local", "degree.py")
sqlContext = SQLContext(sc)
sqlContext.sql("set spark.sql.shuffle.partitions=2")
sc.setLogLevel("ERROR")

def closeness(g):
    # Get list of vertices. We'll generate all the shortest paths at
    # once using this list.
    # YOUR CODE HERE
    vertices = [row.id for row in g.vertices.collect()]
    # vertices = g.vertices.select('*').flatMap(lambda x: x).collect()

    # first get all the path lengths.
    paths = g.shortestPaths(landmarks=vertices)

    # Break up the map and group by ID for summing
    closeness = {row.id: 1.0/sum(row.distances.values()) for row in paths.collect()}
    # for key, value in closeness.items():
    #     print(key, value)
    # Sum by ID
    # closeness = {u'A': 18,
    #              u'C': 14,
    #              u'B': 17,
    #              u'E': 17,
    #              u'D': 15,
    #              u'G': 18,
    #              u'F': 14,
    #              u'I': 21,
    #              u'H': 15,
    #              u'J': 29}
    # Get the inverses and generate desired dataframe.
    df = sc.parallelize(closeness.items()).toDF(['id', 'closeness'])

    return df


print("Reading in graph for problem 2.")
graph = sc.parallelize([('A', 'B'), ('A', 'C'), ('A', 'D'),
                        ('B', 'A'), ('B', 'C'), ('B', 'D'), ('B', 'E'),
                        ('C', 'A'), ('C', 'B'), ('C', 'D'), ('C', 'F'), ('C', 'H'),
                        ('D', 'A'), ('D', 'B'), ('D', 'C'), ('D', 'E'), ('D', 'F'), ('D', 'G'),
                        ('E', 'B'), ('E', 'D'), ('E', 'F'), ('E', 'G'),
                        ('F', 'C'), ('F', 'D'), ('F', 'E'), ('F', 'G'), ('F', 'H'),
                        ('G', 'D'), ('G', 'E'), ('G', 'F'),
                        ('H', 'C'), ('H', 'F'), ('H', 'I'),
                        ('I', 'H'), ('I', 'J'),
                        ('J', 'I')])

e = sqlContext.createDataFrame(graph, ['src', 'dst'])
v = e.selectExpr('src as id').unionAll(e.selectExpr('dst as id')).distinct()
print("Generating GraphFrame.")
g = GraphFrame(v, e)

print("Calculating closeness.")
closeness(g).sort('closeness', ascending=False).show()
closeness(g).sort('closeness', ascending=False).toPandas().to_csv("centrality_out.csv")
