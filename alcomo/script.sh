docker stop alcomo
docker rm alcomo
docker rmi alcomo
docker rmi -f alcomo
docker build -t alcomo .
docker run -p 0.0.0.0:23:22 --name alcomo -d alcomo

# vim src/ExampleXYZ.java
# ant 
# cp src/ExampleXYZ.java dist
# cd dist
# java -cp alcomo.jar ExampleXYZ "requestId" "testdata/conference/ontologies/cmt.owl" "testdata/conference/ontologies/ekaw.owl"  "testdata/conference/alignments/csa-cmt-ekaw.rdf" "testdata/conference/references/cmt-ekaw.rdf"