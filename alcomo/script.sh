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
# java -cp dist/alcomo.jar ExampleXYZ "requestId" "testdata/conference/ontologies/cmt.owl" "testdata/conference/ontologies/ekaw.owl"  "testdata/conference/alignments/csa-cmt-ekaw.rdf" "testdata/conference/references/cmt-ekaw.rdf"
# ssh -p 23 rob@localhost ls /usr/src/app

# f1c74eb1-52a4-413a-90ca-b47be1f35efb-cmt.owl
# 1ac10a7c-716e-41f5-a9c3-9ce349b70d04-ekaw.owl
# 222797fa-621c-4954-81d2-64d3decbd772-csa-cmt-ekaw.rdf
# 3cfb9bcb-43ce-4736-97ea-0f988c87ad32-cmt-ekaw.rdf