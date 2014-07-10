from drippies import app


class TestDrippies(object):
    def setup_method(self, method):
        self.client = app.test_client()

    def test_index(self):
        """The index page should return a 200 response."""
        response = self.client.get('/')

        assert response.status_code == 200
